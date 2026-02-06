interface AIHintProps {
  text: string;
}

export function AIHint({ text }: AIHintProps) {
  return <p className="ai-hint">{text}</p>;
}
