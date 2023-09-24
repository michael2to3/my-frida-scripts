setTimeout(() => {
  Java.perform(() => {
    Java.enumerateLoadedClasses({
      onMatch(className) {
        if (
          className.includes("com.example") // <-- change package
        ) {
          try {
            const classInstance = Java.use(className);

            const constructorOverloads = classInstance.$init.overloads;
            for (let i = 0; i < constructorOverloads.length; i++) {
              hookMethod(classInstance, "$init", i);
            }

            const methods = classInstance.class.getDeclaredMethods();
            methods.forEach((method) => {
              const methodName = method.getName();
              const methodStr = method.toString();
              if (
                methodStr.includes("java.lang.String") ||
                methodStr.includes("java.lang.Number")
              ) {
                const overloadCount =
                  classInstance[methodName].overloads.length;
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
      onComplete() {
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

      const retval = this[methodName].apply(this, arguments);

      if (String(retval).includes("1478")) { // <- replace here
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
}
function checkFieldsRecursive(obj) {
  if (obj === null || obj === undefined) return;

  if (typeof obj === "object") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        checkFieldsRecursive(obj[key]);
      }
    }
  } else if (String(obj).includes("1478")) {
    console.log("Found '1478' in field: ", obj);
  }
}
