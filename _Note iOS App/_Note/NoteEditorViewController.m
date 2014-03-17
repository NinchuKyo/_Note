//
//  NoteEditorViewController.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "NoteEditorViewController.h"

#import "Note.h"

@interface NoteEditorViewController () <UITextViewDelegate>
@property (strong, nonatomic) UIPopoverController *masterPopoverController;
@property (weak, nonatomic) IBOutlet UITextView *textView;
@property (weak, nonatomic) IBOutlet UITextView *noteTitle;

- (void)configureView;
@end

@implementation NoteEditorViewController

#pragma mark - Managing the detail item

- (void)setDetailItem:(id)newDetailItem
{
    if (_detailItem != newDetailItem) {
        _detailItem = newDetailItem;
        
        // Update the view.
        [self configureView];
    }

    if (self.masterPopoverController != nil) {
        [self.masterPopoverController dismissPopoverAnimated:YES];
    }        
}

- (void)configureView
{
    // Update the user interface for the detail item.
    if (self.detailItem) {
        self.detailDescriptionLabel.text = [self.detailItem description];
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
	// Do any additional setup after loading the view, typically from a nib.
    self.noteTitle.text = self.note.title;
    self.noteTitle.delegate = self;
    
    // HTML attributed text viewing
    self.textView.attributedText = self.note.htmlContents;
    self.textView.delegate = self;

    [self configureView];
}

- (IBAction)saveNote:(id)sender {
    NSString *baseURL = @"https://54.201.79.223:5000/save";
    NSString *content = @"<p>";
    [content stringByAppendingString:self.textView.text];
    [content stringByAppendingString:@"</p>"];
    NSMutableDictionary* note = [[NSMutableDictionary alloc] init];
    [note setObject:self.noteTitle.text forKey:@"title"];
    [note setObject:content forKey:@"content"];
    //Boolean* overwrite = NO;
    //NSNumber* overwrite = NO;
    //NSMutableDictionary* data = [[NSMutableDictionary alloc] init];
    //[data setObject:overwrite forKey:@"overwrite"];
    //[data setObject:note forKey:@"note"];
    NSError* error = nil;
    NSData* jsondata = [NSJSONSerialization dataWithJSONObject:note options:NSJSONReadingMutableContainers error:&error];
    
    NSMutableURLRequest* urlRequest = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:baseURL]];
    [urlRequest setHTTPMethod:@"POST"];
    [urlRequest setHTTPBody:jsondata];
    NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:urlRequest delegate:self startImmediately:YES];

}

- (void)textViewDidEndEditing:(UITextView *)textView
{
    [self.note setHTMLContents: textView.attributedText];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Split view

- (void)splitViewController:(UISplitViewController *)splitController willHideViewController:(UIViewController *)viewController withBarButtonItem:(UIBarButtonItem *)barButtonItem forPopoverController:(UIPopoverController *)popoverController
{
    barButtonItem.title = NSLocalizedString(@"View your notes", @"Your Notes");
    [self.navigationItem setLeftBarButtonItem:barButtonItem animated:YES];
    self.masterPopoverController = popoverController;
}

- (void)splitViewController:(UISplitViewController *)splitController willShowViewController:(UIViewController *)viewController invalidatingBarButtonItem:(UIBarButtonItem *)barButtonItem
{
    // Called when the view is shown again in the split view, invalidating the button and popover controller.
    [self.navigationItem setLeftBarButtonItem:barButtonItem animated:YES];
    self.masterPopoverController = nil;
}

@end
