const Home = () => {
  return (
    <div className="flex flex-col items-start pl-24 pt-24"> {/* Added left padding */}
      {/* Main content with left alignment */}
      <div className="space-y-0 mb-16 max-w-xl"> {/* Added max-width for better readability */}
        <p className="text-dynamic">hi,</p>
        <p className="text-dynamic">i'm spongeboi aka shubhaankar</p>
        <p className="text-dynamic">this website kinda describes my life so far</p>
        <p className="text-dynamic">i'm currently nerding out over cs and math at ubc</p>
        <p className="text-dynamic">i also love building cool stuff that helps people</p>
        <p className="text-dynamic">if you're interested in learning more about me,</p>
        <p className="text-dynamic">checkout some of the spheres of life linked below</p>
        <p className="text-dynamic">thanks!</p>
      </div>
    </div>
  );
};

export default Home;