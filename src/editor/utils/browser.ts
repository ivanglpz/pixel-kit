type TExtendBrowser = Navigator & {
  brave?: {
    isBrave?: {
      name?: string;
    };
  };
};

const isBrave = () => {
  const broswer: TExtendBrowser = window.navigator;
  return broswer?.brave?.isBrave?.name == "isBrave";
};
export default isBrave;
