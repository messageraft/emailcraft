import { Header } from "ui";
import { Button } from "@emailcraft/components";

export default function Page() {
  return (
    <div style={{ background: "black" }}>
      <Header text="Web" />
      <Button href="https://example.com" style={button} pY={19}>
        Click me
      </Button>
    </div>
  );
}

const button = {
  backgroundColor: "#ff5a5f",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};
