const matchText = "1478";
const classes = ["com.example"];

setTimeout(main, 5000);

function main() {
  Java.perform(() => {
    Java.enumerateLoadedClasses({
      onMatch: (className) => {
        if (
          classes.some((substring) => className.includes(substring))
        ) {
          try {
            let classInstance = Java.use(className);

            let constructorOverloads = classInstance.$init.overloads;
            for (let i = 0; i < constructorOverloads.length; i++) {
              hookMethod(classInstance, "$init", i);
            }

            let methods = classInstance.class.getDeclaredMethods();
            methods.forEach((method) => {
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
      onComplete: () => {
        console.log("Class enumeration complete");
      },
    });
  });
}
function hookMethod(classInstance, methodName, overloadIndex) {
  classInstance[methodName].overloads[overloadIndex].implementation =
    function () {
      for (var i = 0; i < arguments.length; i++) {
        if (String(arguments[i]).includes(matchText)) {
          console.log(
            "Match found! Class:",
            classInstance.class.getName(),
            ", Method:",
            methodName,
            ", Overload Index:",
            overloadIndex,
          );
          console.log("Arguments:", arguments);
        }
      }
      const rval = this[methodName].apply(this, arguments);
      if (String(rval).includes(matchText)) {
        console.log(
          "Match found in return value! Class:",
          classInstance.class.getName(),
          ", Method:",
          methodName,
          ", Overload Index:",
          overloadIndex,
        );
        console.log("Arguments:", arguments);
      }
      return rval;
    };
}
