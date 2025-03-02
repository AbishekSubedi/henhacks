const businessInsightPrompt = businessData => `
Analyze this business and provide strategic insights and recommendations:

Business Name: ${businessData.name}
Description: ${businessData.description}

Please provide a comprehensive analysis including:

1. Key Strengths:
   - Identify the main competitive advantages
   - Highlight unique selling propositions
   - Analyze market positioning

2. Growth Opportunities:
   - Market expansion possibilities
   - Product/service development opportunities
   - Customer segment opportunities

3. Areas for Improvement:
   - Operational efficiency
   - Customer experience
   - Market presence

4. Strategic Recommendations:
   - Short-term actionable steps (next 3 months)
   - Medium-term strategies (6-12 months)
   - Long-term vision (1-3 years)

5. Risk Analysis:
   - Potential challenges
   - Market threats
   - Mitigation strategies

Please provide specific, actionable insights that can help drive business growth.
`;

const marketAnalysisPrompt = businessData => `
Provide a detailed market analysis for this business:

Business Name: ${businessData.name}
Description: ${businessData.description}

Include:
1. Target Market Analysis
2. Competitor Analysis
3. Market Trends
4. Market Size and Growth Potential
5. Entry Barriers
6. Regulatory Considerations
`;

const marketingStrategyPrompt = businessData => `
Develop a comprehensive marketing strategy for this business:

Business Name: ${businessData.name}
Description: ${businessData.description}

Include:
1. Digital Marketing Recommendations
2. Content Strategy
3. Social Media Approach
4. Customer Acquisition Channels
5. Budget Allocation Suggestions
6. KPIs and Success Metrics
`;

module.exports = {
  businessInsightPrompt,
  marketAnalysisPrompt,
  marketingStrategyPrompt,
};
