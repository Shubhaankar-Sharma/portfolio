const Career = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-8">my career so far</h1>

      <section className="mb-12">
        <h2 className="mb-4">Education</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-body">University of British Columbia</h3>
            <p className="text-secondary-text">Bachelor of Science</p>
            <p className="text-secondary-text">
              Computer Science and Mathematics
            </p>
          </div>
          <div>
            <p className="text-secondary-text">Awards</p>
            <ul className="list-disc list-inside">
              <li>Dean's Honor List (2023)</li>
              <li>Science Scholarship Award (2024)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4">Experience</h2>
        <div>
          <h3 className="text-body">Horizon Blockchain Games Inc.</h3>
          <p className="text-secondary-text">Backend Developer (Part-time)</p>
          <p className="text-secondary-text">Sep 2021 - Sep 2024</p>
        </div>
      </section>

      {/* We'll add the tech circles component here later */}
    </div>
  );
};

export default Career;
