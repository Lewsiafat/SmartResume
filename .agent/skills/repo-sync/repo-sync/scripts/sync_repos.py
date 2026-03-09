import re
import os
import sys

def parse_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配專案名稱與 URL
    # 例如: *1. Picore-W* \n • URL: https://github.com/Lewsiafat/Picore-W
    pattern = r'\*([^*]+)\*\s+• URL: ([^\s]+)'
    matches = re.findall(pattern, content)
    
    repos = []
    for name, url in matches:
        # 去除編號 (如 "1. ") 並獲取原始名稱
        clean_name = re.sub(r'^\d+\.\s*', '', name).strip()
        repos.append({"name": clean_name, "url": url.strip()})
    
    return repos

def update_ts_file(ts_path, new_repos):
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取現有的專案物件列表
    # 假設格式為 export const projects: Project[] = [ ... ]
    match = re.search(r'export const projects: Project\[\] = \[(.*)\]', content, re.DOTALL)
    if not match:
        print("Error: Could not find projects list in TS file.")
        return False
    
    existing_items_str = match.group(1).strip()
    
    # 這裡使用簡單的正則來提取 github 網址以進行比對
    existing_urls = re.findall(r"github: '([^']+)'", existing_items_str)
    
    updated_items = existing_items_str
    
    for repo in new_repos:
        repo_url = repo['url']
        if repo_url not in existing_urls:
            print(f"Adding new repo: {repo['name']}")
            # 生成新條目 (使用 camelCase 作為 id)
            repo_id = ''.join(x for x in repo['name'].title() if not x.isspace())
            repo_id = repo_id[0].lower() + repo_id[1:]
            
            new_entry = f"""
  {{
    id: '{repo_id}',
    emoji: '📁',
    category: 'Full-Stack',
    tags: ['New'],
    stats: ['⭐ New Repo'],
    github: '{repo_url}',
  }},"""
            # 在列表最後添加
            updated_items += new_entry
        else:
            print(f"Repo already exists: {repo['name']}")
    
    new_content = re.sub(
        r'export const projects: Project\[\] = \[.*\]',
        f'export const projects: Project[] = [\n{updated_items.strip()}\n]',
        content,
        flags=re.DOTALL
    )
    
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

if __name__ == "__main__":
    md_source = "ref_src/target_git_repos.md"
    ts_target = "src/data/projects.ts"
    
    if not os.path.exists(md_source):
        print(f"Source file not found: {md_source}")
        sys.exit(1)
        
    repos = parse_md(md_source)
    if update_ts_file(ts_target, repos):
        print("Sync complete!")
    else:
        sys.exit(1)
