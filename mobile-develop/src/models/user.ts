const template = {
  email: '',
  country: '',
  fullname: '',
  id: '',
  token: '',
  phone: '',
  user_hash: '',
  gender: 'Male',
  last_update_task: '',
  created_at: '',
  birth: '',
  city: '',
  code: ''
};
class User {
  data: any;

  constructor(data: any) {
    this.data = { ...template, ...data };
  }
  toJSON() {
    return {
      ...this.data
    };
  }
  static getInstance = (data: any): User => {
    return new User(data);
  };
  static parseSubscribeEmailData(data: any = {}) {
    return {
      id: data.ID,
      createdAt: data.CreatedAt,
      updatedAt: data.UpdatedAt,
      deletedAt: data.DeletedAt,
      user: data.User,
      userID: data.UserID,
      email: data.Email,
      code: data.Code,
      referralCode: data.ReferralCode,
      referralID: data.ReferralID,
      emailInvite: data.EmailInvite
    };
  }

  static parseTokenData(data: any = {}) {
    return {
      token: data.Token,
      Expired: data.Expired
    };
  }
}

export default User;