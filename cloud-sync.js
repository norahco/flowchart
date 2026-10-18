(() => {
  const CONFIG = window.SUPABASE_CONFIG;
  const STORAGE_KEYS = ['sciFandoms', 'sciPeople', 'sciArcs', 'sciShips', 'sciShipOverrides', 'sciFandomNames', 'sciGlossary', 'sciMasterCatalog', 'sciNotes'];
  const client = window.supabase && CONFIG
    ? window.supabase.createClient(CONFIG.url, CONFIG.publishableKey)
    : null;
  let currentUser = null;
  let suppress = false;
  let saveTimer = null;

  const byId = (id) => document.getElementById(id);
  const status = (message, isError = false) => {
    const node = byId('cloudAuthStatus');
    if (!node) return;
    node.textContent = message;
    node.classList.toggle('error', isError);
  };
  const show = (id, visible) => { const node = byId(id); if (node) node.hidden = !visible; };
  const canonical = (value) => {
    if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
    if (value && typeof value === 'object') {
      return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value);
  };
  const snapshot = () => {
    const result = {};
    for (const key of STORAGE_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try { result[key] = JSON.parse(raw); } catch { result[key] = raw; }
      }
    }
    return result;
  };
  const applySnapshot = (data) => {
    suppress = true;
    try {
      for (const key of STORAGE_KEYS) {
        if (Object.prototype.hasOwnProperty.call(data || {}, key)) {
          const value = data[key];
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } else {
          localStorage.removeItem(key);
        }
      }
    } finally { suppress = false; }
  };
  async function saveCloud(showMessage = false) {
    if (!client || !currentUser) return 'local';
    const { error } = await client.from('atlas_data').upsert({
      user_id: currentUser.id,
      data: snapshot()
    }, { onConflict: 'user_id' });
    if (error) {
      status(`Cloud save failed: ${error.message}`, true);
      return 'failed';
    }
    if (showMessage) status('Atlas synced to your account.');
    return 'synced';
  }
  window.syncAtlasNow = () => saveCloud(true);
  function scheduleSave() {
    if (!client || !currentUser || suppress) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveCloud(), 650);
  }
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    if (this === localStorage && STORAGE_KEYS.includes(String(key))) scheduleSave();
  };
  const originalRemoveItem = Storage.prototype.removeItem;
  Storage.prototype.removeItem = function(key) {
    originalRemoveItem.call(this, key);
    if (this === localStorage && STORAGE_KEYS.includes(String(key))) scheduleSave();
  };

  async function refreshUser(user) {
    currentUser = user || null;
    const signedIn = Boolean(currentUser);
    show('cloudEmail', !signedIn);
    show('cloudPassword', !signedIn);
    show('cloudSignIn', !signedIn);
    show('cloudSignUp', !signedIn);
    show('cloudSignOut', signedIn);
    show('cloudAccount', signedIn);
    if (signedIn) {
      byId('cloudAccount').textContent = currentUser.email || 'Signed in';
      window.updateCloudLanguage(localStorage.getItem('sciLocaleV2') || 'en');
      status('Loading your cloud atlas…');
      const { data: row, error } = await client.from('atlas_data')
        .select('data').eq('user_id', currentUser.id).maybeSingle();
      if (error) {
        status(`Could not load cloud data: ${error.message}`, true);
        return;
      }
      if (row && row.data && typeof row.data === 'object') {
        const cloudData = row.data;
        const localData = snapshot();
        const changed = STORAGE_KEYS.some(key => canonical(localData[key] ?? null) !== canonical(cloudData[key] ?? null));
        if (changed) {
          applySnapshot(cloudData);
          status('Cloud atlas loaded. Refreshing the page…');
          setTimeout(() => location.reload(), 300);
        } else {
          status('Cloud atlas is up to date.');
        }
      } else {
        await saveCloud(true);
      }
    } else {
      window.updateCloudLanguage(localStorage.getItem('sciLocaleV2') || 'en');
      status('Not signed in. This browser keeps a local copy.');
    }
  }
  window.updateCloudLanguage = (locale) => {
    const ar = locale === 'ar';
    byId('cloudEmail').placeholder = ar ? 'البريد الإلكتروني' : 'Email address';
    byId('cloudPassword').placeholder = ar ? 'كلمة المرور' : 'Password';
    byId('cloudSignIn').textContent = ar ? 'تسجيل الدخول' : 'Sign in';
    byId('cloudSignUp').textContent = ar ? 'إنشاء حساب' : 'Create account';
    byId('cloudSignOut').textContent = ar ? 'تسجيل الخروج' : 'Sign out';
    byId('cloudIntro').textContent = currentUser
      ? (ar ? 'تُزامَن تعديلاتك مع حسابك وتظهر عند تسجيل الدخول من جهاز آخر.' : 'Your atlas edits sync to this account and are available when you sign in on another device.')
      : (ar ? 'سجّلي الدخول لمزامنة خريطتك بين الأجهزة. قبل تسجيل الدخول، تُحفظ التعديلات في هذا المتصفح.' : 'Sign in to keep your atlas synced across devices. Until you sign in, edits stay in this browser.');
  };

  async function runAuth(action) {
    if (!client) { status('Supabase could not load. Check your internet connection and try again.', true); return; }
    const email = byId('cloudEmail').value.trim();
    const password = byId('cloudPassword').value;
    if (!email || !password) { status('Enter your email address and password.', true); return; }
    status(action === 'signup' ? 'Creating your account…' : 'Signing in…');
    const result = action === 'signup'
      ? await client.auth.signUp({ email, password, options: { emailRedirectTo: 'https://norahco.github.io/flowchart/' } })
      : await client.auth.signInWithPassword({ email, password });
    if (result.error) { status(result.error.message, true); return; }
    if (action === 'signup' && !result.data.session) {
      status('Account created. Check your email, confirm the address, then return here to sign in.');
      return;
    }
    await refreshUser(result.data.user);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!client) { status('Supabase client did not load. Check your internet connection.', true); return; }
    byId('cloudSignIn').addEventListener('click', () => runAuth('signin'));
    byId('cloudSignUp').addEventListener('click', () => runAuth('signup'));
    byId('cloudSignOut').addEventListener('click', async () => {
      const { error } = await client.auth.signOut();
      if (error) status(error.message, true);
      else { currentUser = null; location.reload(); }
    });
    byId('cloudPassword').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') runAuth('signin');
    });
    client.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN' && session?.user) refreshUser(session.user);
      if (_event === 'SIGNED_OUT') { currentUser = null; }
    });
    client.auth.getSession().then(({ data, error }) => {
      if (error) status(error.message, true);
      else refreshUser(data.session?.user || null);
    });
  });
  window.addEventListener('beforeunload', () => {
    if (currentUser) saveCloud();
  });
})();
