import { v4 as uuidv4 } from "uuid";

export default function LoadingShimmer() {
  const randomKeys = Array.from({ length: 150 }, () => uuidv4());
  return (
    <div
      style={{
        height: "150px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {randomKeys?.map((key, i) => (
        <div
          key={key}
          style={{
            width: "4px",
            height: "4px",
            backgroundColor: "#5dade2",
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `blink 1s infinite ${i * 0.05}s`,
            borderRadius: "100px",
          }}
        ></div>
      ))}
      <style>{`
                @keyframes blink {
                    50% { opacity: 0; }
                }
            `}</style>
    </div>
  );
}
