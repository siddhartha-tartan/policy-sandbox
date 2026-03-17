export interface BreRule {
  name: string;
  action: string;
  trigger: string;
  description: string;
  rules: { name: string; description: string }[];
}
