import React, { useEffect, useState } from 'react';
import userPic from '../../media/place-user.jpg';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
    const [user, loading, UserError] = useAuthState(auth);
    const [serverStatus, setServerStatus] = useState(200);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    console.log(users)
    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    useEffect(() => {
        fetch("http://localhost:5000/users", {
            headers: {
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => setUsers(data))
    }, [user?.email])

    // Handle Add to Team Atibhooj
    const handleAddToTeamAtibhooj = (userID) => {
        const targetedUser = users.find(eachUser => eachUser._id === userID);
        const newUserType = [...targetedUser?.userType, "Team Atibhooj"];
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                teamAtibhooj: true,
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))
        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }
    // Handle Remove to Team Atibhooj
    const handleRemoveFromTeamAtibhooj = (userID) => {
        const targetedUser = users?.find(eachUser => eachUser._id === userID);
        const newUserType = targetedUser?.userType.filter(eachType => eachType !== "Team Atibhooj");
        // console.log(newUserType);

        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                teamAtibhooj: false
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }

    // Handle Add to Mentors
    const handleAddToMentorsAtibhooj = (userID) => {
        const targetedUser = users.find(eachUser => eachUser._id === userID);
        const newUserType = [...targetedUser?.userType, "Mentor"];
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                atibhoojMentors: true
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }
    // Handle Remove to Mentors
    const handleRemoveFromMentorsAtibhooj = (userID) => {
        const targetedUser = users?.find(eachUser => eachUser._id === userID);
        const newUserType = targetedUser?.userType.filter(eachType => eachType !== "Mentor");
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                atibhoojMentors: false
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }

    // Handle Add to Active Members
    const handleAddToActiveMembers = (userID) => {
        const targetedUser = users.find(eachUser => eachUser._id === userID);
        const newUserType = [...targetedUser?.userType, "Active Member"];
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                activeMember: true
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }
    // Handle Remove to Mentors
    const handleRemoveFromActiveMembers = (userID) => {
        const targetedUser = users?.find(eachUser => eachUser._id === userID);
        const newUserType = targetedUser?.userType.filter(eachType => eachType !== "Active Member");
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                activeMember: false
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }

    // Handle Add to Contributor
    const handleAddToContributors = (userID) => {
        const targetedUser = users.find(eachUser => eachUser._id === userID);
        const newUserType = [...targetedUser?.userType, "contributor"];
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                contributor: true
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }
    // Handle Remove Contributor
    const handleRemoveFromContributors = (userID) => {
        const targetedUser = users?.find(eachUser => eachUser._id === userID);
        const newUserType = targetedUser?.userType.filter(eachType => eachType !== "contributor");
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                contributor: false
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }

    // Handle Add to OG Member
    const handleAddToOGMembers = (userID) => {
        const targetedUser = users.find(eachUser => eachUser._id === userID);
        const newUserType = [...targetedUser?.userType, "ogmember"];
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                ogMember: true
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }
    // Handle Remove Contributor
    const handleRemoveFromOGMembers = (userID) => {
        const targetedUser = users?.find(eachUser => eachUser._id === userID);
        const newUserType = targetedUser?.userType.filter(eachType => eachType !== "ogmember");
        fetch(`http://localhost:5000/atibhoojMemberHandle/${userID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                ogMember: false
            })
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => console.log(data))

        if (newUserType) {
            fetch(`http://localhost:5000/atibhoojBadgeHandle/${userID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userType: newUserType,
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }

    return (
        <div className="overflow-x-auto m-5 eng-font shadow-lg">
            <table className="table w-full">
                <div className='text-neutral text-[15px]'>
                    {
                        users?.map((eachUser, index) =>
                            <div className='border-b gap-2 mb-8 flex flex-col xl:flex-row xl:justify-between items-center px-8' key={eachUser._id}>
                                <div>{index + 1}</div>
                                <div>{eachUser?.userName}</div>
                                <div><img className='w-[100px] h-[100px] rounded-lg object-cover' src={eachUser?.userProfilePic ? eachUser?.userProfilePic : userPic} alt="" /></div>
                                <div>{eachUser?.userEmail}</div>
                                <div>
                                    <div className='flex flex-col gap-2'>
                                        {
                                            eachUser?.userType?.map(eachType =>
                                                <p>{eachType}</p>)
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className='flex flex-col gap-2'>
                                        <div>
                                            {eachUser?.teamAtibhooj === true ? <button onClick={() => handleRemoveFromTeamAtibhooj(eachUser._id)} className='rounded-sm btn-sm bg-[#FF0000] hover:bg-[#FF0000] focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Remove from t-atibhooj</button> : <button onClick={() => handleAddToTeamAtibhooj(eachUser._id)} className='rounded-sm btn-sm btn-primary hover:bg-primary focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Add to t-atibhooj</button>}
                                        </div>

                                        <div>
                                            {eachUser?.atibhoojMentors === true ? <button onClick={() => handleRemoveFromMentorsAtibhooj(eachUser._id)} className='rounded-sm btn-sm bg-[#FF0000] hover:bg-[#FF0000] focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Remove from m-atibhooj</button> : <button onClick={() => handleAddToMentorsAtibhooj(eachUser._id)} className='rounded-sm btn-sm btn-primary hover:bg-primary focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Add to m-atibhooj</button>}
                                        </div>

                                        <div>
                                            {eachUser?.activeMember === true ? <button onClick={() => handleRemoveFromActiveMembers(eachUser?._id)} className='rounded-sm btn-sm bg-[#FF0000] hover:bg-[#FF0000] focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Remove from active Members</button> : <button onClick={() => handleAddToActiveMembers(eachUser?._id)} className='rounded-sm btn-sm btn-primary hover:bg-primary focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Add to Active Member</button>}
                                        </div>

                                        <div>
                                            {eachUser?.contributor === true ? <button onClick={() => handleRemoveFromContributors(eachUser?._id)} className='rounded-sm btn-sm bg-[#FF0000] hover:bg-[#FF0000] focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Remove from contributor</button> : <button onClick={() => handleAddToContributors(eachUser?._id)} className='rounded-sm btn-sm btn-primary hover:bg-primary focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Add to contributor</button>}
                                        </div>

                                        <div>
                                            {eachUser?.ogMember === true ? <button onClick={() => handleRemoveFromOGMembers(eachUser?._id)} className='rounded-sm btn-sm bg-[#FF0000] hover:bg-[#FF0000] focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Remove from OG Member</button> : <button onClick={() => handleAddToOGMembers(eachUser?._id)} className='rounded-sm btn-sm btn-primary hover:bg-primary focus:outline-none border-0 hover:border-0 text-white mb-4 w-full btn text-[11px]'>Add to OG Member</button>}
                                        </div>
                                    </div>
                                </div>
                            </div>)
                    }
                </div>
            </table>
        </div>
    );
};

export default AllUsers;