setTimeout(() => {
  Java.perform(function () {
    Java.enumerateLoadedClasses({
      onMatch: function (className) {
        if (
          className.includes("ru.bspb") ||
          className.includes("j30.") ||
          className.includes("d1.") ||
          className.includes("fz.") ||
          className.includes("a0.") ||
          className.includes("tw.")
        ) {
          try {
            let classInstance = Java.use(className);

            let constructorOverloads = classInstance.$init.overloads;
            for (let i = 0; i < constructorOverloads.length; i++) {
              hookMethod(classInstance, "$init", i);
            }

            let methods = classInstance.class.getDeclaredMethods();
            methods.forEach(function (method) {
              let methodName = method.getName();
              let methodStr = method.toString();
              if (
                methodStr.includes("java.lang.String") ||
                methodStr.includes("java.lang.Number")
              ) {
                let overloadCount = classInstance[methodName].overloads.length;
                for (let i = 0; i < overloadCount; i++) {
                  try {
                    hookMethod(classInstance, methodName, i);
                  } catch (err) {
                    console.error(
                      "Error hooking overload:",
                      methodName,
                      i,
                      err,
                    );
                  }
                }
              }
            });
          } catch (err) {
            console.error("Error processing class:", className, err);
          }
        }
      },
      onComplete: function () {
        console.log("Class enumeration complete");
      },
    });
  });
}, 5000);

  function hookMethod(classInstance, methodName, overloadIndex) {
      classInstance[methodName].overloads[overloadIndex].implementation =
        function () {
          for (let i = 0; i < arguments.length; i++) {
            checkFieldsRecursive(arguments[i]);
          }

          let retval = this[methodName].apply(this, arguments);

          if (String(retval).includes("1478")) {
            console.log(
              "Match found in return value! Class:",
              classInstance.class.getName(),
              ", Method:",
              methodName,
              ", Overload Index:",
              overloadIndex,
            );
            console.log("Return value:", retval);
          }

          checkFieldsRecursive(retval);

          return retval;
        };
function checkFieldsRecursive(obj) {
  if (obj === null || obj === undefined) return;

  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        checkFieldsRecursive(obj[key]);
      }
    }
  } else if (String(obj).includes("1478")) {
    console.log("Found '1478' in field: ", obj);
  }
}
