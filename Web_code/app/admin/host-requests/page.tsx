import React from "react";
import HostRequestsTable from "../components/HostRequestsTable";
import Container from "@/app/components/ui/Container";

const HostRequestsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <HostRequestsTable />
      </Container>
    </div>
  );
};

export default HostRequestsPage;
