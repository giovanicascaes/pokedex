import { animated, easings, useTransition } from "@react-spring/web"
import { Breadcrumb } from "components"
import { PageBreadcrumbItem, usePage } from "contexts"
import { AppBreadcrumbProps } from "./app-breadcrumb.types"

const BREADCRUMB_TRANSITION_DURATION = 150

export default function AppBreadcrumb(props: AppBreadcrumbProps) {
  const [{ breadcrumb }] = usePage()

  const transition = useTransition(breadcrumb, {
    key: ({ label }: PageBreadcrumbItem) => label,
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

  return (
    <Breadcrumb {...props}>
      {transition((styles, { label, href }) => (
        <animated.div style={{ ...styles }}>
          <Breadcrumb.Item className="app-header-text">
            {href ? (
              <Breadcrumb.Link href={href}>{label}</Breadcrumb.Link>
            ) : (
              label
            )}
          </Breadcrumb.Item>
        </animated.div>
      ))}
    </Breadcrumb>
  )
}
