import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <header>
        <Button variant="secondary" onClick={() => navigate("/app")}>
          Back to dashboard
        </Button>
        <h2>{title}</h2>
      </header>

      <Card>
        <p className="hint">{description}</p>
      </Card>
    </div>
  );
}
