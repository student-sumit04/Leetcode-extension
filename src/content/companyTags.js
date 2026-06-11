import { getCompanyInfo } from '../services/companyService';
import { apiService } from '../services/apiService';

export function renderCompanyTags() {
  // Wait for page to fully load
  setTimeout(async () => {
    try {
      const slug = window.location.pathname.split('/')[2];

      if (!slug) return;

      let companyInfo = getCompanyInfo(slug);

      try {
        const response = await apiService.getCompanyData(slug);
        companyInfo = {
          companies: response.data.companies || [],
          source: response.data.source,
          inferred: response.data.inferred,
        };
      } catch (error) {
        console.error('Unable to load AI company tags:', error);
        // Continue with local company info if API fails
      }

      const { companies } = companyInfo;

      if (companies.length === 0) return;

      const container = document.createElement('div');
      container.id = 'leetcode-ai-companies';

      container.style.position = 'fixed';
      container.style.bottom = '80px';
      container.style.right = '20px';
      container.style.padding = '15px';
      container.style.background = '#1f1f1f';
      container.style.color = '#ffffff';
      container.style.marginTop = '20px';
      container.style.zIndex = '99998';
      container.style.borderRadius = '8px';
      container.style.border = '2px solid #ffa116';
      container.style.fontSize = '14px';
      container.style.maxWidth = '200px';

      const title = document.createElement('h4');
      title.innerText =
        companyInfo.source === 'ai'
          ? 'AI Likely Companies'
          : companyInfo.inferred
          ? 'Likely Companies'
          : 'Companies Asked';
      title.style.margin = '0 0 10px 0';
      title.style.color = '#ffa116';
      title.style.fontSize = '12px';
      title.style.textTransform = 'uppercase';
      title.style.fontWeight = 'bold';

      container.appendChild(title);

      const tagContainer = document.createElement('div');
      tagContainer.style.display = 'flex';
      tagContainer.style.flexWrap = 'wrap';
      tagContainer.style.gap = '8px';

      companies.forEach((company) => {
        const tag = document.createElement('span');
        tag.innerText = company;
        tag.style.backgroundColor = '#ffa116';
        tag.style.color = '#1f1f1f';
        tag.style.padding = '4px 8px';
        tag.style.borderRadius = '4px';
        tag.style.fontSize = '11px';
        tag.style.fontWeight = '600';

        tagContainer.appendChild(tag);
      });

      container.appendChild(tagContainer);
      document.body.appendChild(container);
    } catch (error) {
      console.error('Error rendering company tags:', error);
    }
  }, 1500);
}
