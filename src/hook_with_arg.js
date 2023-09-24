setTimeout(() => {
  Java.perform(() => {
    Java.enumerateLoadedClasses({
      onMatch: (className) => {
        const classes = ["com.example"];
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
}, 5000);

const hookMethod = (classInstance, methodName, overloadIndex) => {
  classInstance[methodName].overloads[overloadIndex].implementation = () => {
    for (let i = 0; i < arguments.length; i++) {
      if (String(arguments[i]).includes("1478")) {
        console.log(
          "Match found in arguments! Class:",
          classInstance.class.getName(),
          ", Method:",
          methodName,
          ", Overload Index:",
          overloadIndex,
        );
        console.log("Arguments:", arguments);
      }
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

    return retval;
  };
};
