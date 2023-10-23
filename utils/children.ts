import { Children, Fragment, ReactNode } from "react"

function getRawChildrenAsArray(children: ReactNode) {
  return Children.toArray(children).filter(Boolean)
}

export function getChildrenAsArray(children: ReactNode) {
  const childrenAsArray = getRawChildrenAsArray(children)

  if (childrenAsArray.length > 1) {
    return childrenAsArray
  }

  const [onlyChild] = childrenAsArray

  if (
    typeof onlyChild === "object" &&
    "type" in onlyChild &&
    onlyChild.type === Fragment
  ) {
    return getRawChildrenAsArray(onlyChild.props.children as ReactNode[])
  }

  return childrenAsArray
}
