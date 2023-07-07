
const style = {
  namespaced: true,
  state: {
    screenSize: "",
  },
  getters: {
    getScreenSize: state => state.screenSize,

    isXS: state => state.screenSize == "xs",
    isSM: state => state.screenSize == "sm",
    isMD: state => state.screenSize == "md",
    isLG: state => state.screenSize == "lg",
    isXL: state => state.screenSize == "xl",
    isXSsmaller: (state, getters) => getters.isXS,
    isSMsmaller: (state, getters) => getters.isSM || getters.isXSsmaler,
    isMDsmaller: (state, getters) => getters.isMD || getters.isSMsmaller,
    isLGsmaller: (state, getters) => getters.isLG || getters.isMDsmaller,
    isXLsmaller: (state, getters) => getters.isXL || getters.isLGsmaller,

    //------------------Icon----------------------------------------------------
    getIcon: () => type => {
      switch(type) {
        case "Contest": return "mdi-trophy";
        case "Course": return "mdi-school-outline";
        case "Test/Exam": return "mdi-note-edit-outline";
        case "programming-exercise": return "mdi-code-json";
        case "quiz": return "mdi-head-question-outline";
        case "code": return "mdi-code-json";
        case "pdf": return "mdi-file-pdf-box";
        case "video": return "mdi-video";
        case "home": return "mdi-home-variant";
        case "student": return "mdi-account-school";
        case "content": return "mdi-content-save-edit";
        case "settings": return "mdi-cog"
        case "account": return "mdi-card-account-details";
        case "blank": return "mdi-text-box-outline";
        case "skeleton": return "mdi-text-box-plus-outline";
        case "buggy": return "mdi-bug";
        case "delete": return "mdi-delete";
        case "edit": return "mdi-pencil";
        case "lesson": return "mdi-note-text-outline"  
        case "question": return "mdi-chat-question-outline"
        default: return "";
      }
    },
    getIconSmallSize: (state, getters) => {
      if (getters.isSMsmaller) return "large";
      else if (getters.isMD) return "large";
      else return "x-large";
    },
    getIconMediumSize: (state, getters) => {
      if (getters.isSMsmaller) return "xx-large";
      else if (getters.isMD) return "x-large";
      else return "xx-large";
    },
    getIconBigSize: (state, getters) => {
      if (getters.isSMsmaller) return "xx-large";
      else if (getters.isMD) return "x-large";
      else return "xx-large";
    },

    //------------------Button--------------------------------------------------
    getButtonSmallSize: (state, getters) => {
      if (getters.isSMsmaller) return "x-small";
      else if (getters.isMD) return "x-small";
      else return "small";
    },
    getButtonMediumSize: (state, getters) => {
      if (getters.isSMsmaller) return "medium";
      else if (getters.isMD) return "small";
      else return "medium";
    },

    
    getButtonSize: (state, getters) => {
      if (getters.isSMsmaller) return "";
      else if (getters.isMD) return "small";
      else return "";
    },

    //------------------Avatar--------------------------------------------------
    getAvatarSmallSize: (state, getters) => {
      if (getters.isSMsmaller) return "35";
      else if (getters.isMD) return "35";
      else return "45";
    },
    getAvatarMediumSize: (state, getters) => {
      if (getters.isSMsmaller) return "65";
      else if (getters.isMD) return "55";
      else return "65";
    },

    //------------------Text----------------------------------------------------
    getSmallTextClass: (state, getters) => {
      if (getters.isSMsmaller) return "text-body-2";
      else if (getters.isMD) return "text-caption";
      else return "text-body-2";
    },
    getTextClass: (state, getters) => {
      if (getters.isSMsmaller) return "text-body-1";
      else if (getters.isMD) return "text-body-2";
      else return "text-body-1";
    },
    getTitleClass: (state, getters) => {
      if (getters.isSMsmaller) return "text-h4";
      else if (getters.isMD) return "text-h5";
      else return "text-h4";
    },
    getSubtitleClass: (state, getters) => {
      if (getters.isSMsmaller) return "text-h6";
      else if (getters.isMD) return "text-subtitle-1 font-weight-medium";
      else return "text-h6";
    },

    //-----------------Snackbar-------------------------------------------------
    getErrorSnackbar: () => text => {
      const snackbar = {
        text:text,
        color:"error",
        icon:"mdi-alpha-x-circle-outline",
        timeout:4000,
        open:true
      }
      return snackbar
    },
    getSuccessSnackbar: () => text => {
      const snackbar = {
        text:text,
        color:"success",
        icon:"mdi-check-circle-outline",
        timeout:2000,
        open:true
      }
      return snackbar
    },
  
  },
  mutations: {
    setScreenSize(state, size) {
      if (size <= 480) state.screenSize = "xs";
      else if (size <= 768) state.screenSize = "sm";
      else if (size <= 1024) state.screenSize = "md";
      else if (size <= 1280) state.screenSize = "lg";
      else state.screenSize = "xl";
    },
  },
  actions: {},
}

export default style