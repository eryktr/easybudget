db.createCollection('user');
db.createCollection('budget');
db.createCollection('transaction');

function getUser(username) {
    // Password is 'password'
    return {
        username: username,
        password_sha2: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        _cls: 'easybudget.db.model.User'
    }
}

function getTransaction(owner, type, amount, description) {
    return {
        owner: owner,
        type_: type,
        amount: amount,
        description: description,
        _cls: 'easybudget.db.model.Transaction'
    }
}

function getBudget(name, amount, author, contributors=null, transactions=null) {
    if (contributors == null) {
        contributors = []
    }
    if (transactions == null) {
        transactions = []
    }
    return {
        name: name,
        amount: amount,
        author: author,
        transactions: transactions,
        contributors: contributors,
        _cls: 'easybudget.db.model.Budget'
    }
}
let user1 = getUser('user1');
let user2 = getUser('user2');
let user3 = getUser('user3');
db.user.insertMany([user1, user2, user3]);

let t1 = getTransaction(user1, 'EXPENSE', 5.0, 'Coffee');
let t2 = getTransaction(user1, 'EXPENSE', 300, '40 liters of PB95');

let b1 = getBudget('Food', 500.0, user1);
let b2 = getBudget('Fuel', 300, user2, [user1], [t1, t2]);
let b3 = getBudget('Games', 200.0, user1);
let b4 = getBudget('Clothes', 650.0, user1);
let b5 = getBudget('Traveling', 1000.0, user1);
let b6 = getBudget('Eating out', 100.0, user1);
let b7 = getBudget('Something', 1000.0, user1);
let b8 = getBudget('SomethingElse', 100.0, user1);
let b9 = getBudget('Education', 2000.0, user1);
let b10 = getBudget('Fun', 300.0, user1);


db.transaction.insertMany([t1, t2]);
db.budget.insertMany([b1, b2, b3, b4, b5, b6, b7, b8, b9, b10]);
