if (ObjC.available) {
    ObjC.schedule(ObjC.mainQueue, function() {
        var LAContext = ObjC.classes.LAContext;

        var canEvaluatePolicy = LAContext["- canEvaluatePolicy:error:"];

        Interceptor.attach(canEvaluatePolicy.implementation, {
            onEnter: function(args) {
                console.log("Enter canEvaluatePolicy:error:");
            },
            onLeave: function(retval) {
                retval.replace(1);

                var errorPtr = this.context.r1;
                var error = new ObjC.Object(errorPtr);
                error.setValue_forKey_(null, "code");
                console.log("Change canEvaluatePolicy");
            }
        });
    });
} else {
    console.log("Objective-C runtime is not available!");
}
