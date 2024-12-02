const Home = () => {
  return (
    <div className="flex flex-col items-start p-4 md:pl-24 md:pt-24 pt-40">
      {" "}
      {/* Responsive padding */}
      {/* Main content with left alignment */}
      <div className="space-y-0 mb-16 max-w-full md:max-w-3xl">
        {" "}
        {/* Responsive max-width */}
        <p className="text-dynamic">hi,</p>
        <p className="text-dynamic">i'm spongeboi aka shubhaankar</p>
        <p className="text-dynamic">
          i'm currently nerding out over cs and math at ubc
        </p>
        <p className="text-dynamic">
          i currently love distributed systems, cryptography and electronics
        </p>
        <p className="text-dynamic">
          i also love building cool stuff that helps people
        </p>
        <p className="text-dynamic">checkout some of the pages linked below</p>
        <p className="text-dynamic">thanks!</p>
      </div>
    </div>
  );
};

export default Home;
