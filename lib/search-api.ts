export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    // Return mock results when no API key is configured
    return getMockResults(query);
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      q: query,
      engine: "baidu",
      num: "10",
    });

    const res = await fetch(`https://serpapi.com/search?${params}`);
    if (!res.ok) {
      console.error(`SerpAPI error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results: SearchResult[] = (data.organic_results ?? []).map(
      (r: { title?: string; link?: string; snippet?: string }) => ({
        title: r.title ?? "",
        url: r.link ?? "",
        snippet: r.snippet ?? "",
      })
    );

    return results;
  } catch (err) {
    console.error("Search API error:", err);
    return [];
  }
}

function getMockResults(query: string): SearchResult[] {
  // Extract the name from query (between quotes)
  const nameMatch = query.match(/"([^"]+)"/);
  const name = nameMatch?.[1] ?? "用户";

  return [
    {
      title: `${name}的个人简历 - 百度文库`,
      url: "https://wenku.baidu.com/view/example123",
      snippet: `${name}，联系方式：138****1234，毕业于XX大学，现任XX公司工程师...`,
    },
    {
      title: `关于${name}的讨论 - 知乎`,
      url: "https://www.zhihu.com/question/example456",
      snippet: `有人认识${name}吗？听说在XX公司工作，住在XX区...`,
    },
    {
      title: `${name} - 微博搜索`,
      url: "https://weibo.com/search?q=example",
      snippet: `#${name}# 手机号被泄露，个人信息在网上流传...`,
    },
  ];
}
