import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import {
  employees,
  trainingModules,
  incidents,
  reports,
  chatConversations,
  incidentTrendData,
  departmentComplianceData,
  incidentDistribution,
  getEmployeeById,
  getTrainingById,
  getIncidentById,
  getReportById,
  getReportsByIncidentId,
  getEmployeesByDepartment,
  getIncidentsByDepartment,
  getActiveIncidents,
  getDaysSinceLastIncident,
  getOverdueTraining,
  getExpiredCertifications,
  getExpiringCertifications,
  getOutdatedModules,
  getAtRiskEmployees,
} from "@/lib/mock-data";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
);

// Create a comprehensive context string with all mock data
function getAllDataContext(): string {
  return `You are an AI safety assistant for DeLong Safety Management System. You have access to complete company safety data.

CURRENT DATE: ${new Date().toISOString().split("T")[0]}

## EMPLOYEES (${employees.length} total)
${JSON.stringify(employees, null, 2)}

## TRAINING MODULES (${trainingModules.length} total)
${JSON.stringify(trainingModules, null, 2)}

## INCIDENTS (${incidents.length} total)
${JSON.stringify(incidents, null, 2)}

## REPORTS (${reports.length} total)
${JSON.stringify(reports, null, 2)}

## INCIDENT TRENDS
${JSON.stringify(incidentTrendData, null, 2)}

## DEPARTMENT COMPLIANCE DATA
${JSON.stringify(departmentComplianceData, null, 2)}

## INCIDENT DISTRIBUTION BY TYPE
${JSON.stringify(incidentDistribution, null, 2)}

## CURRENT STATISTICS
- Days since last incident: ${getDaysSinceLastIncident()}
- Active incidents: ${getActiveIncidents().length}
- Overdue training assignments: ${getOverdueTraining().length}
- Expired certifications: ${getExpiredCertifications().length}
- Certifications expiring in 90 days: ${getExpiringCertifications(90).length}
- Outdated training modules: ${getOutdatedModules().length}
- At-risk employees: ${getAtRiskEmployees().length}

## OVERDUE TRAINING DETAILS
${JSON.stringify(getOverdueTraining(), null, 2)}

## EXPIRED CERTIFICATIONS
${JSON.stringify(getExpiredCertifications(), null, 2)}

## EXPIRING CERTIFICATIONS (next 90 days)
${JSON.stringify(getExpiringCertifications(90), null, 2)}

## AT-RISK EMPLOYEES
${JSON.stringify(getAtRiskEmployees(), null, 2)}

## INSTRUCTIONS
- Provide accurate, data-driven answers based on the above information
- Use specific employee names, dates, and numbers from the data
- Format responses with markdown for readability (use **bold**, bullet points, etc.)
- When discussing compliance rates, calculate percentages accurately
- Always cite specific data points (employee names, incident IDs, dates)
- Provide actionable recommendations when appropriate
- If asked about trends, reference the trend data
- Be professional and safety-focused
- If you don't have specific data to answer a question, be honest about it`;
}

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey =
      process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey || apiKey === "YOUR_COMPLETE_API_KEY_HERE") {
      return NextResponse.json(
        {
          error: "API key not configured",
          details:
            "Please add your Google API key to the .env file as GOOGLE_API_KEY",
        },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    // Initialize the model with Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: getAllDataContext(),
    });

    // Build chat history from messages
    const chatHistory = messages
      .slice(0, -1)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    });

    // Send message and get response
    const result = await chat.sendMessage(latestMessage);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      model: "gemini-2.0-flash-exp",
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
