import { auth } from "@/lib/auth";
import { CallView } from "@/modules/call/ui/views/call-view";
// import { loadSearchParams } from "@/modules/agents/params";
// import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
// import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// // import { List } from "@radix-ui/react-tabs";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import { SearchParams } from "nuqs";
// import { Suspense } from "react";
// import {ErrorBoundary} from "react-error-boundary";

interface Props{
    params: Promise<{
        meetingId: string;
    }>;
};

const Page = async({params}: Props) => {
    const {meetingId}=await params;

    const session =await auth.api.getSession({
        headers: await headers(),
      });
      
      if (!session){
        redirect("/sign-in");
      }

      
    const queryClient= getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId})
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CallView meetingId={meetingId}/>
        </HydrationBoundary>
    );
};

export default Page;