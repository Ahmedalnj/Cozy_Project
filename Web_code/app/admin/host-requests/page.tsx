import React from "react";
import HostRequestsTable from "../components/HostRequestsTable";
import Container from "@/app/components/ui/Container";

const HostRequestsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إدارة طلبات المضيف
          </h1>
          <p className="text-gray-600">
            مراجعة وإدارة طلبات المستخدمين للانضمام كمضيفين
          </p>
        </div>

        <HostRequestsTable />
      </Container>
    </div>
  );
};

export default HostRequestsPage;






