import styled from "@emotion/styled";
import { Button } from "components/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "components/stack.ts";
import { useState } from "react";
import { RequestsPageViewModel } from "src/views/requests/requests.vm.ts";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { observer } from "mobx-react-lite";
import { PageHeader } from "components/pageHeader.tsx";
import { Input } from "components/input.tsx";
import { ColumnConfig, GridCell, ResponsiveTable } from "components/table.tsx";
import { RequestsDto } from "api/models/requests.model.ts";
import { findLineIconByName } from "src/assets/metro.tsx";

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${(p) => p.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 6px 8px;
  border-radius: 4px;
  color: ${(p) =>
    p.status === "new"
      ? p.theme.colors.status.new
      : p.status === "processed_auto"
        ? p.theme.colors.status.processed_auto
        : p.status === "processed"
          ? p.theme.colors.status.processed
          : p.theme.colors.status.completed};
  background-color: ${(p) =>
    p.status === "new"
      ? `${p.theme.colors.status.new}30`
      : p.status === "processed_auto"
        ? `${p.theme.colors.status.processed_auto}30`
        : p.status === "processed"
          ? `${p.theme.colors.status.processed}30`
          : `${p.theme.colors.status.completed}30`};
  border: 1px solid
    ${(p) =>
      p.status === "new"
        ? p.theme.colors.status.new
        : p.status === "processed_auto"
          ? p.theme.colors.status.processed_auto
          : p.status === "processed"
            ? p.theme.colors.status.processed
            : p.theme.colors.status.completed};
  font-weight: 700;
  text-align: center;
`;

const RequestsPage = observer(() => {
  const [vm] = useState(() => new RequestsPageViewModel());
  const navigate = useNavigate();

  const columns: ColumnConfig[] = [
    { header: "ФИО пассажира" },
    { header: "Откуда" },
    { header: "Куда" },
    { header: "Дата и время", centred: true },
    { header: "Статус", centred: true },
  ];

  const renderCellContent = (
    columnHeader: string,
    request: RequestsDto.Request,
  ) => {
    switch (columnHeader) {
      case "ФИО пассажира":
        return (
          <Link to={`/requests/${request.id}`}>{request.passenger.name}</Link>
        );
      case "Откуда": {
        return (
          <Stack direction={"row"} gap={5} align={"center"}>
            {findLineIconByName(request.station_from.name_line)}
            {request.station_from.name_station}
          </Stack>
        );
      }
      case "Куда": {
        return (
          <Stack direction={"row"} gap={5} align={"center"}>
            {findLineIconByName(request.station_to.name_line)}
            {request.station_to.name_station}
          </Stack>
        );
      }
      case "Дата и время":
        return new Date(request.datetime).toLocaleString();
      case "Статус":
        return (
          <StatusBadge status={request.status}>
            {RequestsDto.localizeRequestStatus(request.status)}
          </StatusBadge>
        );
      default:
        return null;
    }
  };

  const renderRow = (request: RequestsDto.Request, columns: ColumnConfig[]) => (
    <>
      {columns.map((column, index) => (
        <GridCell key={index} header={column.header} centred={column.centred}>
          {renderCellContent(column.header, request)}
        </GridCell>
      ))}
    </>
  );

  return (
    <Stack wFull hFull direction={"column"} gap={20}>
      <ContentHeader>
        <PageHeader>Заявки</PageHeader>
        <Button onClick={() => navigate("/requests/new")}>
          Добавить заявку
        </Button>
      </ContentHeader>

      {vm.isLoading ? (
        <LoaderWrapper height={"100%"}>
          <Loader />
        </LoaderWrapper>
      ) : (
        <>
          <Stack direction={"row"} align={"center"} gap={10}>
            <Input placeholder={"Поиск"} style={{ width: "300px" }} />
          </Stack>
          <ResponsiveTable
            columns={columns}
            data={vm.requests}
            renderRow={renderRow}
          />
        </>
      )}
    </Stack>
  );
});

export default RequestsPage;
