import Millennium
from datetime import datetime
import git, os, json, shutil
from unidiff import PatchSet
from api.themes_store import find_all_themes
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
        origin = repo.remote(name='origin')
        print(f"fetching origin {origin.url}")
        origin.fetch()

        print("pulling from origin")
        # Pull the changes into the local repository
        result = origin.pull()
        print(result)

        for item in cache_update_list:
            if item["native"] == native:
                cache_update_list.remove(item)

    except git.InvalidGitRepositoryError:
        return False
    
    return True

def check_updates(theme: str, repo: git.Repo):
    global cache_update_list
    changes = repo.git.diff(repo.commit())

    patch_set = PatchSet(changes.splitlines())
    diff_cache = {'files': set(), 'added': 0, 'removed': 0}

    for patched_file in patch_set:
        diff_cache['files'].add(patched_file.path)
        for hunk in patched_file:
            diff_cache['added'] += hunk.added
            diff_cache['removed'] += hunk.removed

    needs_update = diff_cache['added'] + diff_cache['removed'] > 0

    if not needs_update:
        return
    
    latest_commit = repo.head.commit
    commit_message = latest_commit.message.strip()
    commit_date = arrow.get(latest_commit.committed_date).humanize()
    commit_url = repo.remotes.origin.url.rstrip('.git') + '/commit/' + latest_commit.hexsha

    name = theme["data"]["name"] if "name" in theme["data"] else theme["native"]

    cache_update_list.append({
        'message': commit_message, 'date': commit_date, 'commit': commit_url,
        'native': theme["native"], 'name': name
    })

    print(f"{theme['native']} has update -> {needs_update}")

def initialize_repositories():
    global cache_update_list
    cache_update_list.clear()

    themes = json.loads(find_all_themes())

    for theme in themes:

        path = os.path.join(Millennium.steam_path(), "steamui", "skins", theme["native"])
        # Initialize the repository
        try: 
            repo = git.Repo(path)
            # print(f"successfully opened {theme['native-name']}")
            check_updates(theme, repo)
            repo.close()

        except git.InvalidGitRepositoryError:
            if "github" in theme["data"]:
                pull_head(path, theme["data"]["github"])


        except Exception as e:
            # Code to handle the exception
            print(f"An exception occurred: {e}")

    
