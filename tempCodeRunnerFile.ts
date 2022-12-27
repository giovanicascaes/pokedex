function pick<T extends Object>(object: T, ...attrs: PropertyKey[]) {
    return Object.entries(object)
      .filter(([attr]) => attrs.includes(attr))
      .reduce<Omit<T, typeof attrs[number]>>(
        (obj, [k, v]) => ({
          ...obj,
          [k]: v,
        }),
        {}
      );
  }
  
  const res = pick({ a: "a", b: "b" }, "a");
  console.log("🚀 ~ file: Untitled-1:14 ~ res", res)
  