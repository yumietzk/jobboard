import Content from "./Content";

function Main({
  isLoading,
  searchTerm,
  onResetSearch,
  filterList,
  handleDeleteSelected,
  filteredJobs,
}) {
  return (
    <main className="w-full">
      {isLoading ? (
        <p>loading...</p>
      ) : (
        <Content
          filterList={filterList}
          onDeleteSelected={handleDeleteSelected}
          jobs={filteredJobs}
          searchTerm={searchTerm}
          onResetSearch={onResetSearch}
        />
      )}
    </main>
  );
}

export default Main;
