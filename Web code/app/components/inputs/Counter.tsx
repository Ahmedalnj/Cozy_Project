"use client";
interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}
const Counter: React.FC<CounterProps> = ({}) => {
  return <div></div>;
};

export default Counter;
