import { animated, easings, useTransition } from "@react-spring/web"
import { Breadcrumb } from "components"
import { usePage } from "contexts"
import { useMemo } from "react"
import { AppBreadcrumbProps } from "./app-breadcrumb.types"

const BREADCRUMB_TRANSITION_DURATION = 150

export default function AppBreadcrumb(props: AppBreadcrumbProps) {
  const [{ breadcrumb }] = usePage()
  const breadcrumbId = useMemo(
    () => breadcrumb.map(({ label }) => label).join(" / "),
    [breadcrumb]
  )

  const breadcrumbData = useMemo(
    () => ({
      breadcrumbId,
      breadcrumb,
    }),
    [breadcrumb, breadcrumbId]
  )

  const transition = useTransition(breadcrumbData, {
    config: {
      easing: easings.linear,
      duration: BREADCRUMB_TRANSITION_DURATION,
    },
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    exitBeforeEnter: true,
  })

  return transition((styles, { breadcrumb }) => (
    <animated.div style={{ ...styles }}>
      <Breadcrumb {...props}>
        {breadcrumb.map(({ label, href }) => (
          <Breadcrumb.Item key={label} className="app-header-text">
            {href ? (
              <Breadcrumb.Link href={href}>{label}</Breadcrumb.Link>
            ) : (
              label
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </animated.div>
  ))
}