import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "../../ui/invoices/buttons";
import Search from "@/app/ui/search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Table from "@/app/ui/invoices/table";
import Pagination from "@/app/ui/invoices/pagination";
import {fetchInvoicesPages} from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages  = await fetchInvoicesPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between
      gap-2 md:mt-8">
        <Search placeholder="搜索发票..."/>
        <CreateInvoice/>
      </div>
      <Suspense fallback={<InvoicesTableSkeleton/>} key={query + currentPage}>
        <Table query={query} currentPage={currentPage}></Table>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  )
}
