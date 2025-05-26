class Settings {
  disableDecentralized?: any;

  constructor(json: any) {
    if (!json) {
      return {};
    }

    this.disableDecentralized = json.DisableDecentralized;
  }
}

export default Settings;
