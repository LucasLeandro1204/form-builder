import tooltipDirective from "./Tooltip";
import focusDirective from "./Focus";

// register all directives
const directives = (app) => {
  tooltipDirective(app);
  focusDirective(app);
};

export default directives;
