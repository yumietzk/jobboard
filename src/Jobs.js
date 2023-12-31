import { useEffect, useState } from "react";
import Header from "./Header";
import SearchInput from "./SearchInput";
import Main from "./Main";
import { formatString } from "./utils/formatString";
import FilterButton from "./FilterButton";
import Selection from "./Selection";

const data = require("./testData.json");

const jobType = [
  "Full time",
  "Part time",
  "Contract",
  "Internship",
  "Freelance",
];

const skill = ["React", "JavaScript", "iOS", "Android", "AWS"];

function addItem(array, item) {
  return [...array, item];
}

function deleteItem(array, item) {
  return array.filter((cur) => cur !== item);
}

function createNewSelected(selected, label) {
  return selected.includes(label)
    ? deleteItem(selected, label)
    : addItem(selected, label);
}

function Jobs() {
  const [status, setStatus] = useState({ isLoading: false, error: "" });
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedJobType, setSelectedJobType] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const filterList = [...selectedJobType, ...selectedSkill];

  const formattedSelectedJobType = selectedJobType.map((item) =>
    formatString(item)
  );
  const formattedSelectedSkill = selectedSkill.map((item) =>
    formatString(item)
  );

  const filteredJobs =
    selectedJobType.length > 0 || selectedSkill.length > 0
      ? jobs
          .filter((job) =>
            selectedJobType.length > 0
              ? formattedSelectedJobType.includes(formatString(job.job_type))
              : true
          )
          .filter((job) => {
            return selectedSkill.length > 0
              ? job.tags.some((item) => {
                  return formattedSelectedSkill.includes(formatString(item));
                })
              : true;
          })
      : jobs;

  const { isLoading, error } = status;

  const formattedSearchTerm = formatString(searchTerm);
  // 🤨compare with descriptionは難しそう
  const searchedJobs = searchTerm
    ? jobs.filter(
        (job) =>
          formatString(job.title).includes(formattedSearchTerm) ||
          job.tags.some((item) => {
            return formatString(item).includes(formattedSearchTerm);
          })
      )
    : jobs;

  useEffect(() => {
    setStatus((status) => ({ ...status, isLoading: true, error: "" }));
    // ⚠️ 本来は、まずここで全部のjobを引っ張ってきた後に、このavailable listを計算する感じ。
    // 💡 In the below case, extract jobs available in Japan
    const availableJobsList = data.jobs.filter(
      (job) =>
        job.candidate_required_location === "Worldwide" ||
        job.candidate_required_location.includes("Asia") ||
        job.candidate_required_location.includes("Easter Asia") ||
        job.candidate_required_location.includes("Japan")
    );
    setJobs(availableJobsList);

    setStatus((status) => ({ ...status, isLoading: false }));
    // const getJobs = async () => {
    //   try {
    //     setStatus((status) => ({ ...status, isLoading: true, error: "" }));

    //     const res = await fetch(
    //       // ⚠️ Will figure out how many we fetch later!!!
    //       "https://remotive.com/api/remote-jobs?limit=30"
    //     );
    //     const data = await res.json();
    //     // console.log(data);

    //     setJobs(data);
    //   } catch (err) {
    //     console.error(err);
    //     setStatus((status) => ({ ...status, error: err.message }));
    //   } finally {
    //     setStatus((status) => ({ ...status, isLoading: false }));
    //   }
    // };

    // getJobs();
  }, []);

  function handleSearch(term) {
    setSearchTerm(term.trim());
  }

  function handleResetSearch() {
    setSearchTerm("");
  }

  function handleSelectedJobType(label) {
    const newSelected = createNewSelected(selectedJobType, label);

    setSelectedJobType(newSelected);
  }

  function handleSelectedSkill(label) {
    const newSelected = createNewSelected(selectedSkill, label);

    setSelectedSkill(newSelected);
  }

  function handleDeleteSelected(item) {
    if (selectedJobType.includes(item)) {
      const newSelected = deleteItem(selectedJobType, item);

      setSelectedJobType(newSelected);
    }

    if (selectedSkill.includes(item)) {
      const newSelected = deleteItem(selectedSkill, item);

      setSelectedSkill(newSelected);
    }
  }

  return (
    <>
      <div className="mb-12">
        <Header>
          <SearchInput onSearch={handleSearch} />
          <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
        </Header>

        {filterOpen && (
          <div className="mt-4 space-y-3">
            <Selection
              title="Job type"
              labelData={jobType}
              filterList={filterList}
              onSelected={handleSelectedJobType}
            />
            <Selection
              title="Skill"
              labelData={skill}
              filterList={filterList}
              onSelected={handleSelectedSkill}
            />
          </div>
        )}
      </div>

      <Main
        isLoading={isLoading}
        jobs={searchedJobs}
        searchTerm={searchTerm}
        onResetSearch={handleResetSearch}
        filterList={filterList}
        handleDeleteSelected={handleDeleteSelected}
        filteredJobs={filteredJobs}
      />
    </>
  );
}

export default Jobs;
