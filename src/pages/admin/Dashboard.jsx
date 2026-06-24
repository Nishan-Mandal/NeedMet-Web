import { SystemState } from "../../components";
import featureImg from "../../assets/maintenance.jpg"

export default function Dashboard() {
  return (
    <SystemState
      imageSrc={featureImg}
      title="Feature in "
      highlight="Progress"
      message="We're currently building this feature and working hard to bring it to you. Check back soon for updates!"
      actionType="navigate"
      actionLabel="Go Back"
      actionTo={-1}
    />
  )
}