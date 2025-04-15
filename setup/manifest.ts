export default {
  name: 'Chrome Tab Mute',
  version: '1.0.3',
  manifest_version: 3,
  description: 'Mute or unmute tabs with one click',
  permissions: ['tabs', 'storage', 'offscreen'],
  host_permissions: ['<all_urls>'],

  background: {
    service_worker: 'index.js',
  },

  icons: {
    128: 'images/active-128.png',
  },

  action: {
    default_title: 'Mute/Unmute Tab',
    default_icon: 'images/normal-white-128.png',
  },

  web_accessible_resources: [
    {
      resources: ['*'],
      matches: ['<all_urls>'],
    },
  ],

  commands: {
    'toggle-mute-current-tab': {
      suggested_key: { default: 'Ctrl+M', mac: 'Command+M' },
      description: 'Toggle mute for the current tab',
    },
  },
}
