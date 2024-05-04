import time
import Millennium
from datetime import datetime
import git, os, json, shutil
from unidiff import PatchSet
from api.themes_store import find_all_themes
import requests
import arrow

def pull_head(path: str, data: any) -> None:

    print(data)

    try:
        shutil.rmtree(path)
        repo_url = f'https://github.com/{data["owner"]}/{data["repo_name"]}.git'
        print(repo_url)
        # Clone the repository
        git.Repo.clone_from(repo_url, path)

    except Exception as e:
        # Code to handle the exception
        print(f"An exception occurred: {e}")

cache_update_list = []

def get_cached_updates():
    global cache_update_list
    return json.dumps(cache_update_list)

def update_theme(native: str) -> bool:
    path = os.path.join(Millennium.steam_path(), "steamui", "skins", native)
    # Initialize the repository
    try: 
        repo = git.Repo(path)
        # Fetch the latest changes from the remote repository
        # origin = repo.remote(name='origin')
        # origin.fetch()

        # Get the default branch name
        default_branch = repo.active_branch.name

        repo.git.reset('--hard', f'origin/{default_branch}')

    except git.InvalidGitRepositoryError:
        return False
    
    return True

def needs_update(remote_commit: str, theme: str, repo: git.Repo):

    # Get the default branch name
    default_branch = repo.active_branch.name

    # Get the local and remote commit hashes for the default branch
    local_commit = getattr(repo.heads[default_branch], "commit", None)
    needs_update = local_commit != remote_commit if local_commit and remote_commit else False

    # # Compare the local and remote commit hashes
    # print(f"Theme {theme['native']} needs update -> {needs_update}\n\tlocal commit: {local_commit}\n\tremote commit: {remote_commit}")
    return needs_update


def initialize_repositories():
    global cache_update_list
    cache_update_list.clear()

    start_time = time.time()

    themes = json.loads(find_all_themes())

    update_query = []

    for theme in themes:

        path = os.path.join(Millennium.steam_path(), "steamui", "skins", theme["native"])
        # Initialize the repository
        try: 
            repo = git.Repo(path)
            # print(f"successfully opened {theme['native-name']}")
            update_query.append({'theme': theme, 'repo': repo})
            repo.close()

        except git.InvalidGitRepositoryError:
            if "github" in theme["data"]:
                pull_head(path, theme["data"]["github"])


        except Exception as e:
            # Code to handle the exception
            print(f"An exception occurred: {e}")

    
    post_body = []

    for item in update_query:

        theme = item['theme']

        if "github" in theme.get("data", {}):

            github_data = theme["data"]["github"]

            owner = github_data.get("owner")
            repo = github_data.get("repo_name")
            
            # Skip iteration if either owner or repo is null
            if owner is None or repo is None:
                continue
    
            post_body.append({'owner': owner, 'repo': repo})

    print(json.dumps(post_body))

    # Make the POST request
    response = requests.post("https://steambrew.app/api/v2/checkupdates", data=json.dumps(post_body))

    if response.status_code == 200:
        print(response.json())

        remote_json = response.json()

        for item in update_query:

            theme = item['theme']
            if "github" in theme.get("data", {}):

                github_data = theme["data"]["github"]
                repo = github_data.get("repo_name")

                if repo is None:
                    continue

                remote = next((item for item in remote_json if item.get("name") == repo), None)
                update_needed = needs_update(remote['commit'], theme, item['repo'])

                print(update_needed)

                commit_message = remote['message']
                commit_date = arrow.get(remote['date']).humanize()
                commit_url = remote['url']

                name = theme["data"]["name"] if "name" in theme["data"] else theme["native"]

                cache_update_list.append({
                    'message': commit_message, 'date': commit_date, 'commit': commit_url,
                    'native': theme["native"], 'name': name
                })

            


    print(f"initialize_repositories took: {round((time.time() - start_time) * 1000, 4)} milliseconds")

    
