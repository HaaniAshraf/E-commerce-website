// block user
async function blockUser(userId) {
    try {
        const response = await fetch(`/blockUser/${userId}`, {
            method: 'POST',
        });
        if (response.ok) {
          showBlockConfirmation()
        } else {
            console.log('Error blocking user. Please try again.');
        }

    } catch (error) {
        console.error('Error blocking user:', error);
    }
}


// unblock user
async function unblockUser(userId) {
    try {
        const response = await fetch(`/unblockUser/${userId}`, {
            method: 'POST',
        });

        if (response.ok) {
          showUnblockConfirmation()
        } else {
            console.log('Error unblocking user. Please try again.');
        }

    } catch (error) {
        console.error('Error unblocking user:', error);
    }
    }


// remove user
    async function removeUser(userId) {
        try {
            const response = await fetch(`/removeUser/${userId}`, {
                method: 'POST',
            });
    
            const data = await response.json();
    
            if (data.success) {
                alert('User removed successfully.');
                window.location.href = "/userlist";
            } else {
                alert('Error removing user. Please try again.');
            }
    
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Internal Server Error. Please try again.');
        }
    }


// block sweet alert
    function showUnblockConfirmation(userId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to unblock this user?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(63, 170, 87)',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, unblock!',
        backdrop: 'rgba(0,0,0,0.9)'
    }).then(async(result) => {
        if (result.isConfirmed) {
            await submitForm(`unblockForm${userId}`);
            window.location.href = "/userlist";
            }
        });
    }


 // unblock sweet alert
  function showBlockConfirmation(userId) {
      Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to block this user?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, block!',
          backdrop: 'rgba(0,0,0,0.9)'
      }).then(async(result) => {
          if (result.isConfirmed) {
              await submitForm(`blockForm${userId}`);
              window.location.href = "/userlist";
          }
      });
  }


// remove sweet alert
  function showRemoveConfirmation(userId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this user?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove!',
        backdrop: 'rgba(0,0,0,0.9)',
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById(`removeForm${userId}`).submit();
        }
    });
    }


// form submission
    async function submitForm(formId) {
        const form = document.getElementById(formId);
        await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
        });
        }
