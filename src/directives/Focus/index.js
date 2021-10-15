const focusDirective = (app) => {
    app.directive("focus", {
        mounted(el) {
            el.focus()
        }
    });
};

export default focusDirective;
