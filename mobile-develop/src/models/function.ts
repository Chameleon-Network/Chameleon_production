class FunctionConfigModel {
  name?;
  message?;
  disabled?;

  constructor(data: any) {
    if (!data) {
      return {};
    }

    this.name = data?.Name || '';
    this.message = data?.Message || '';
    this.disabled = !!data?.Disable;
  }
}

export default FunctionConfigModel;
