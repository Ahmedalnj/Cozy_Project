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
      xl:px-20         // Larger padding on extra large screens
      lg:px-10         // Standard padding on large screens
      md:px-8          // Medium padding on tablets
      sm:px-6          // Small padding on small tablets
      px-4 
      "
    >
      {children}
    </div>
  );
};

export default Container;
