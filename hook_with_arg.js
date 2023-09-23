setTimeout(() => {
Java.perform(function() {
  Java.enumerateLoadedClasses({
    onMatch: function(className) {
      if (className.startsWith("ru.bspb")) {
        try {
          var classInstance = Java.use(className);
          var methods = classInstance.class.getDeclaredMethods();
          methods.forEach(function(method) {
            var methodName = method.getName();
            var methodStr = method.toString();
            if (methodStr.includes("java.lang.String") || methodStr.includes("java.lang.Number")) {
              var overloadCount = classInstance[methodName].overloads.length;
              for (var i = 0; i < overloadCount; i++) {
                try {
                  hookMethod(classInstance, methodName, i);
                } catch (err) {
                  console.error("Error hooking overload:", methodName, i, err);
                }
              }
            }
          });
        } catch (err) {
          console.error("Error processing class:", className, err);
        }
      }
    },
    onComplete: function() {
      console.log("Class enumeration complete");
    }
  });
});
}, 5000);

function hookMethod(classInstance, methodName, overloadIndex) {
  classInstance[methodName].overloads[overloadIndex].implementation = function() {
    for (var i = 0; i < arguments.length; i++) {
      console.log(arguments[i]);
      if (String(arguments[i]).includes("1478")) {
        console.log("Match found! Class:", classInstance.class.getName(), ", Method:", methodName, ", Overload Index:", overloadIndex);
        console.log("Arguments:", arguments);
      }
    }
    return this[methodName].apply(this, arguments);
  };
}
