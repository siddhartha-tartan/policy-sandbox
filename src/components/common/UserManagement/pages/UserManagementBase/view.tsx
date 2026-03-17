import PageLayout from "../../../PageLayout";
import useGetUsers from "../../hooks/useGetUsers";
import Header from "./components/Header";
import SearchFilter from "./components/SearchFilter";
import UserTable from "./components/UserTable";

export default function UserManagementBase() {
  const {
    data,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setAiAccess,
    setStatus,
    setRoles,
    setCategories,
    searchQuery,
    status,
    roles,
    categories,
    aiAccess,
  } = useGetUsers();

  return (
    <PageLayout>
      <div className="flex flex-col p-4 pb-2 gap-6 bg-white border border-[#FFF] rounded-[16px] w-full h-full overflow-y-auto">
        <Header />
        <SearchFilter
          setSearchQuery={setSearchQuery}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setAiAccess={setAiAccess}
          setStatus={setStatus}
          startDate={startDate}
          endDate={endDate}
          userData={data}
          setRoles={setRoles}
          setCategories={setCategories}
          searchQuery={searchQuery}
          statusFilter={status}
          rolesFilter={roles}
          categoriesFilter={categories}
          aiAccess={aiAccess}
        />
        {isLoading ? (
          <></>
        ) : !data?.data?.length ? (
          <></>
        ) : (
          <UserTable
            data={data}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        )}
      </div>
    </PageLayout>
  );
}
