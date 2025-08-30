"use client";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="
      max-w-screen-2xl  // Similar to Airbnb's very wide container
      mx-auto
      xl:px-15         // Larger padding on extra large screens
      lg:px-8         // Standard padding on large screens
      md:px-6          // Medium padding on tablets
      sm:px-4          // Small padding on small tablets
      px-2 
      "
    >
      {children}
    </div>
  );
};

export default Container;
