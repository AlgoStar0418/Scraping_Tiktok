from projects.models import Project
from projects.serializers import ProjectSerializer
from django.shortcuts import get_object_or_404

def validate_project(request, project_id):
    try:
        project = get_object_or_404(Project, project_id)
        request.project = ProjectSerializer(project).data
        return True
    except Exception as e:
        return {'error': str(e)}