import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";
const LIST_ENDPOINT = `${GINGER_BASE}/bac/mapping/annotate/list-ongoing-projects-for-annotator`;
const STATS_ENDPOINT = `${GINGER_BASE}/bac/mapping/annotate/list-projects-with-statistics`;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ginger_access_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    // 1️⃣ Get the basic list of ongoing projects
    const listRes = await fetch(LIST_ENDPOINT, { method: "POST", headers, body: "{}" });
    const listData = await listRes.json();

    if (!listRes.ok) {
      console.error("Ginger API List Error:", listRes.status, listData);
      return NextResponse.json(
        { success: false, error: listData.error ?? "Failed to fetch project list", details: listData },
        { status: listRes.status }
      );
    }

    const projects = listData.ongoing_annotate_list || [];

    // If there are no projects, return early with debug info
    if (projects.length === 0) {
      return NextResponse.json({ success: true, data: { annotate_list: [] }, debug: listData });
    }

    // 2️⃣ Extract the project IDs and fetch statistics for them
    const annotateIds = projects.map((p: any) => p.annotate_id);
    
    const statsRes = await fetch(STATS_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ annotate_id_list: annotateIds }),
    });
    
    const statsData = await statsRes.json();
    
    if (!statsRes.ok) {
      console.error("Ginger API Stats Error:", statsRes.status, statsData);
      // Fallback to just returning projects without statistics if stats fail
      return NextResponse.json({ success: true, data: { annotate_list: projects } });
    }

    // 3️⃣ Merge statistics back into the project objects
    const statsList = statsData.annotate_list || [];
    
    const mergedProjects = projects.map((project: any) => {
      const stats = statsList.find((s: any) => s.annotate_id === project.annotate_id);
      return {
        ...project,
        statistics: stats?.statistics || null
      };
    });

    // 4️⃣ Return merged data in the format the frontend expects
    return NextResponse.json({
      success: true,
      data: { annotate_list: mergedProjects },
    });

  } catch (err) {
    console.error("Projects API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
