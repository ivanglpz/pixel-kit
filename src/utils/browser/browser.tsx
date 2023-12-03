type TExtendBrowser = Navigator & {
  brave?: {
    isBrave?: {
      name?: string;
    };
  };
};

const isBrave = () => {
  const broswer: TExtendBrowser = window.navigator;
  if (broswer?.brave != undefined) {
    return broswer?.brave?.isBrave?.name == "isBrave";
  }
  return false;
};
export default isBrave;
